using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    // The goal of creating this class is, for instance we do not want cars with the model name of Foo, be shown in the search
    // Or created. Inside the masstransit and RabbitMq, we will see the error inside the masstransit.fault, but there is
    // nowhere inside the application to see that. For changing or showing the error from mass transit, we implement this class
    // So that we can understand and handle the errors
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        var exception = context.Message.Exceptions.First();

        if (exception.ExceptionType == "System.ArgumentException")
        {
            context.Message.Message.Model = "Foobar";
            await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("Not an argument exception - update error dashboard somewhere");
        }
    }
}